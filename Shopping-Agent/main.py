import os
from dotenv import load_dotenv
from langchain.agents import initialize_agent, AgentType
from langchain.tools import StructuredTool
from chains.tools import make_tools, run_shopping_flow
from llm.llm_provider import get_chat_llm

load_dotenv()

model = "GOOGLE"
API_KEY = os.getenv(f"{model}_API_KEY")
MODEL = os.getenv(f"{model}_MODEL")
PROVIDER = os.getenv(f"{model}_PROVIDER")
API_URL = os.getenv("API_URL")

USER_ID = "B456"

tools = make_tools(
    user_id=USER_ID,
    api_key=API_KEY,
    model_name=MODEL,
    model_provider=PROVIDER,
    spring_url=API_URL
)

def run_shopping_flow_no_args():
    return run_shopping_flow(
        user_id=USER_ID,
        api_key=API_KEY,
        model_name=MODEL,
        model_provider=PROVIDER,
        spring_url=API_URL
    )

tools.append(
    StructuredTool.from_function(
        func=run_shopping_flow_no_args,
        name="run_shopping_flow",
        description="Run end-to-end: recommend -> search -> purchase -> memory",
        return_direct=True
    )
)

llm = get_chat_llm(
    api_key=API_KEY,
    model_name=MODEL,
    model_provider=PROVIDER
)

agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.OPENAI_FUNCTIONS,
    verbose=True
)

if __name__ == "__main__":
    result = agent.run("Please execute the shopping flow for me.")
    print("\nAgent output:\n", result)