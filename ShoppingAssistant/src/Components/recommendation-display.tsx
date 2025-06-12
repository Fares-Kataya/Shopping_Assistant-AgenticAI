"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Brain, TrendingUp, ArrowRight } from "lucide-react";
import type { Recommendation } from "../Pages/page";

interface RecommendationDisplayProps {
	recommendation: Recommendation;
	onNext: () => void;
	isLoading: boolean;
}

export function RecommendationDisplay({
	recommendation,
	onNext,
	isLoading,
}: RecommendationDisplayProps) {
	const getConfidenceColor = (confidence: number) => {
		if (confidence >= 0.8) return "bg-green-100 text-green-800";
		if (confidence >= 0.6) return "bg-yellow-100 text-yellow-800";
		return "bg-red-100 text-red-800";
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Brain className="h-5 w-5 text-purple-600" />
					AI Recommendation
				</CardTitle>
				<CardDescription>Based on purchase history analysis</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="p-4 bg-purple-50 rounded-lg">
					<div className="flex items-center justify-between mb-3">
						<h3 className="font-semibold text-purple-900">
							Recommended Category
						</h3>
						<Badge className={getConfidenceColor(recommendation.confidence)}>
							<TrendingUp className="h-3 w-3 mr-1" />
							{Math.round(recommendation.confidence * 100)}% confidence
						</Badge>
					</div>

					<div className="text-2xl font-bold text-purple-700 mb-3 capitalize">
						{recommendation.category.replace("-", " ")}
					</div>

					<div className="text-purple-800">
						<h4 className="font-medium mb-2">AI Reasoning:</h4>
						<p className="text-sm leading-relaxed">
							{recommendation.justification}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
					<div className="flex-1">
						<h4 className="font-medium text-blue-900">Next Step</h4>
						<p className="text-sm text-blue-700">
							Search our catalog for products in the{" "}
							{recommendation.category.replace("-", " ")} category
						</p>
					</div>
					<Button onClick={onNext} disabled={isLoading}>
						{isLoading ? (
							"Searching..."
						) : (
							<>
								Search Products
								<ArrowRight className="h-4 w-4 ml-2" />
							</>
						)}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
