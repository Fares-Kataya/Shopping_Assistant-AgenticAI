import axios from "axios";
import type { BuyerProfile } from "../Pages/page";

const API_URL = "http://localhost:8080/api/buyers";

export function saveBuyerHistory(profile: BuyerProfile) {
	return axios.post<void>(`${API_URL}/history`, profile);
}

export async function fetchBuyerHistory(
	userId: string
): Promise<BuyerProfile["history"]> {
	try {
		const response = await axios.get(`${API_URL}/${userId}/history`);
		return response.data.history || [];
	} catch (error) {
		console.error("Error fetching buyer history:", error);
		throw error;
	}
}