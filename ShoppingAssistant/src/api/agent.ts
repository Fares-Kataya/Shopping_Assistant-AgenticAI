import axios from "axios";
import type { BuyerProfile, Recommendation } from "../Pages/page";

export interface AgentRecommendation {
	category: string;
	reason: string;
}

const AGENT_URL = "http://localhost:8000";

export async function getRecommendation(
	profile: BuyerProfile
): Promise<Recommendation> {
	try {
		const response = await axios.post<Recommendation>(
			`${AGENT_URL}/run-shopping-flow`,
			{
				user_id: profile.user_id,
				history: profile.history,
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error getting recommendation from agent:", error);
		throw error;
	}
}
export async function logPurchase(userId: string, product: any): Promise<any> {
	const resp = await axios.post(`${AGENT_URL}/log-purchase`, {
		user_id: userId,
		product,
	});
	return resp.data;
}

export async function updateAgentMemory(
	userId: string,
	product: any
): Promise<any> {
	const resp = await axios.post(`${AGENT_URL}/update-memory`, {
		user_id: userId,
		product,
	});
	return resp.data;
}