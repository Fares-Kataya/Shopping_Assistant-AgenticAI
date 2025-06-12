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
import { Search, Star, DollarSign } from "lucide-react";
import type { Product } from "../Pages/page";

interface ProductSearchProps {
	products: Product[];
	onProductSelect: (product: Product) => void;
	isLoading: boolean;
}

export function ProductSearch({
	products,
	onProductSelect,
	isLoading,
}: ProductSearchProps) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Search className="h-5 w-5 animate-spin" />
						Searching Products...
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{[1, 2, 3].map((i) => (
							<div key={i} className="p-4 border rounded-lg animate-pulse">
								<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
								<div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
								<div className="h-3 bg-gray-200 rounded w-1/4"></div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Search className="h-5 w-5 text-blue-600" />
					Product Search Results
				</CardTitle>
				<CardDescription>
					Top 3 products matching your preferences
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{products.map((product, index) => (
						<div
							key={product.id}
							className="p-4 border rounded-lg hover:shadow-md transition-shadow">
							<div className="flex items-start justify-between mb-3">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<Badge variant="outline">#{index + 1}</Badge>
										<h3 className="font-semibold text-lg">{product.name}</h3>
									</div>
									<p className="text-gray-600 text-sm mb-2">
										{product.description}
									</p>

									<div className="flex items-center gap-4">
										<div className="flex items-center gap-1">
											<DollarSign className="h-4 w-4 text-green-600" />
											<span className="font-bold text-green-600">
												${product.price}
											</span>
										</div>

										<div className="flex items-center gap-1">
											<Star className="h-4 w-4 text-yellow-500 fill-current" />
											<span className="text-sm">{product.rating}</span>
										</div>

										<Badge variant="secondary" className="capitalize">
											{product.category.replace("-", " ")}
										</Badge>
									</div>
								</div>

								<Button
									onClick={() => onProductSelect(product)}
									className="ml-4">
									Select
								</Button>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
