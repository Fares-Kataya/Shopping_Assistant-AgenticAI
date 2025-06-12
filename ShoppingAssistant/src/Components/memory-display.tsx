import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../Components/ui/card";
import { Badge } from "../Components/ui/badge";
import { History, Brain, ShoppingBag, DollarSign } from "lucide-react";
import type { BuyerProfile, Recommendation, PurchaseResult } from "../Pages/page";

interface MemoryDisplayProps {
	profile: BuyerProfile;
	recommendation?: Recommendation | null;
	purchaseResult?: PurchaseResult | null;
}

export function MemoryDisplay({
	profile,
	recommendation,
	purchaseResult,
}: MemoryDisplayProps) {
	const totalSpent = profile.history.reduce((sum, item) => sum + item.price, 0);
	const categories = [...new Set(profile.history.map((item) => item.category))];

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<History className="h-5 w-5" />
						Memory & Context
					</CardTitle>
					<CardDescription>Current session information</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<h4 className="font-medium mb-2">User Profile</h4>
						<div className="text-sm space-y-1">
							<div className="flex justify-between">
								<span>User ID:</span>
								<Badge variant="outline">{profile.user_id}</Badge>
							</div>
							<div className="flex justify-between">
								<span>Total Purchases:</span>
								<span>{profile.history.length}</span>
							</div>
							<div className="flex justify-between">
								<span>Total Spent:</span>
								<span className="font-medium">${totalSpent}</span>
							</div>
						</div>
					</div>

					<div>
						<h4 className="font-medium mb-2">Categories</h4>
						<div className="flex flex-wrap gap-1">
							{categories.map((category) => (
								<Badge key={category} variant="secondary" className="text-xs">
									{category}
								</Badge>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<ShoppingBag className="h-5 w-5" />
						Purchase History
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{profile.history.map((item, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-2 bg-gray-50 rounded">
								<div className="flex-1">
									<div className="font-medium text-sm">{item.product}</div>
									<div className="text-xs text-gray-500">{item.category}</div>
								</div>
								<div className="text-sm font-medium">${item.price}</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{recommendation && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<Brain className="h-5 w-5 text-purple-600" />
							AI Insights
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="text-sm">
								<span className="font-medium">Recommended:</span>
								<Badge variant="outline" className="ml-2 capitalize">
									{recommendation.category.replace("-", " ")}
								</Badge>
							</div>
							<div className="text-sm">
								<span className="font-medium">Confidence:</span>
								<span className="ml-2">
									{Math.round(recommendation.confidence * 100)}%
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{purchaseResult && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg text-green-600">
							<DollarSign className="h-5 w-5" />
							Latest Purchase
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2 text-sm">
							<div className="font-medium">{purchaseResult.product.name}</div>
							<div className="text-gray-600">
								${purchaseResult.product.price}
							</div>
							<Badge variant="outline" className="text-xs">
								{purchaseResult.transaction_id}
							</Badge>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
