import os
import getpass
from langchain.chat_models import init_chat_model
from langchain.llms import LlamaCpp

def get_chat_llm(api_key: str = None, model_name: str = None, temperature: float = 0.7, model_provider: str = "openai"):
    if model_provider in ("openai", "anthropic", "google_genai"):
        env_key = os.environ.get(
            f"{model_provider.upper().replace('_', '')}_API_KEY")
        if not api_key and not env_key:
            api_key = getpass.getpass(f"Enter API key for {model_provider}: ")
            os.environ[f"{model_provider.upper().replace('_', '')}_API_KEY"] = api_key
        if not api_key:
            api_key = env_key
        if not model_name:
            model_name = os.getenv(
                f"{model_provider.upper().replace('_', '')}_MODEL", "default-model")
        try:
            if model_provider == "anthropic":
                model = init_chat_model(
                    model_name,
                    model_provider=model_provider,
                    anthropic_api_key=api_key,
                    temperature=temperature
                )
            elif model_provider == "google_genai":
                model = init_chat_model(
                    model_name,
                    model_provider=model_provider,
                    google_api_key=api_key,
                    temperature=temperature
                )
            else:  # OpenAI
                model = init_chat_model(
                    model_name,
                    model_provider=model_provider,
                    openai_api_key=api_key,
                    temperature=temperature
                )
            print(f"Successfully initialized {model_provider} model: {model_name}")
            return model

        except Exception as e:
            print(f"Error initializing {model_provider} model: {e}")
            raise
    elif model_provider == "llamacpp":
        model_path = os.getenv("LLAMA_MODEL_PATH")
        if not model_path or not os.path.exists(model_path):
            raise ValueError(
                "LLAMA_MODEL_PATH not set or file doesn't exist in your .env"
            )
        return LlamaCpp(
            model_path=model_path,
            n_ctx=2048,
            temperature=temperature
        )
    else:
        raise ValueError(f"Unsupported model provider: {model_provider}")