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
import { CreditCard, ShoppingCart, Star, DollarSign } from "lucide-react";
import type { Product } from "../Pages/page";

interface PurchaseSimulationProps {
	product: Product;
	onPurchase: () => void;
	isLoading: boolean;
}

export function PurchaseSimulation({
	product,
	onPurchase,
	isLoading,
}: PurchaseSimulationProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<CreditCard className="h-5 w-5 text-green-600" />
					Purchase Confirmation
				</CardTitle>
				<CardDescription>
					Review your selected product before purchase
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="p-6 bg-gray-50 rounded-lg">
					<div className="flex items-start gap-4">
						<div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
							<ShoppingCart className="h-8 w-8 text-blue-600" />
						</div>

						<div className="flex-1">
							<h3 className="text-xl font-bold mb-2">{product.name}</h3>
							<p className="text-gray-600 mb-3">{product.description}</p>

							<div className="flex items-center gap-4 mb-4">
								<div className="flex items-center gap-1">
									<DollarSign className="h-5 w-5 text-green-600" />
									<span className="text-2xl font-bold text-green-600">
										${product.price}
									</span>
								</div>

								<div className="flex items-center gap-1">
									<Star className="h-4 w-4 text-yellow-500 fill-current" />
									<span>{product.rating} rating</span>
								</div>

								<Badge variant="secondary" className="capitalize">
									{product.category.replace("-", " ")}
								</Badge>
							</div>
						</div>
					</div>
				</div>

				<div className="p-4 bg-blue-50 rounded-lg">
					<h4 className="font-medium text-blue-900 mb-2">Order Summary</h4>
					<div className="space-y-2 text-sm">
						<div className="flex justify-between">
							<span>Product:</span>
							<span>{product.name}</span>
						</div>
						<div className="flex justify-between">
							<span>Price:</span>
							<span>${product.price}</span>
						</div>
						<div className="flex justify-between">
							<span>Tax:</span>
							<span>${(product.price * 0.08).toFixed(2)}</span>
						</div>
						<div className="border-t pt-2 flex justify-between font-bold">
							<span>Total:</span>
							<span>${(product.price * 1.08).toFixed(2)}</span>
						</div>
					</div>
				</div>

				<Button
					onClick={onPurchase}
					className="w-full"
					size="lg"
					disabled={isLoading}>
					{isLoading ? "Processing..." : "Complete Purchase"}
				</Button>
			</CardContent>
		</Card>
	);
}
