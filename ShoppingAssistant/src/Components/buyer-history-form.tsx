import type React from "react";
import { useState, useEffect } from "react"; // Import useEffect
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { Label } from "../Components/ui/label";
import { Badge } from "../Components/ui/badge";
import { Plus, Trash2, User } from "lucide-react";
import type { BuyerProfile } from "../Pages/page";

interface BuyerHistoryFormProps {
	onSubmit: (profile: BuyerProfile) => void;
	isLoading: boolean;
	initialUserId?: string;
	initialHistory?: BuyerProfile["history"] | null;
}

export function BuyerHistoryForm({
	onSubmit,
	isLoading,
	initialUserId,
	initialHistory,
}: BuyerHistoryFormProps) {
	const [userId, setUserId] = useState(initialUserId || "");
	const [history, setHistory] = useState<BuyerProfile["history"]>(
		initialHistory || []
	);

	useEffect(() => {
		if (initialUserId !== undefined && initialUserId !== null) {
			setUserId(initialUserId);
		}
	}, [initialUserId]);

	useEffect(() => {
		if (initialHistory !== undefined && initialHistory !== null) {
			setHistory(initialHistory);
		}
	}, [initialHistory]);

	const addHistoryItem = () => {
		setHistory([...history, { product: "", category: "", price: 0 }]);
	};

	const removeHistoryItem = (index: number) => {
		setHistory(history.filter((_, i) => i !== index));
	};

	const updateHistoryItem = (
		index: number,
		field: string,
		value: string | number
	) => {
		const updated = [...history];
		updated[index] = { ...updated[index], [field]: value };
		setHistory(updated);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const validHistory = history.filter(
			(item) => item.product.trim() && item.category.trim() && item.price >= 0 // allow price 0
		);

		onSubmit({
			user_id: userId,
			history: validHistory,
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<User className="h-5 w-5" />
					Buyer Profile Input
				</CardTitle>
				<CardDescription>
					Enter the buyer's purchase history to get personalized recommendations
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<Label htmlFor="userId">User ID</Label>
						<Input
							id="userId"
							value={userId}
							onChange={(e) => setUserId(e.target.value)}
							placeholder="Enter user ID"
							required
						/>
					</div>

					<div>
						<div className="flex items-center justify-between mb-4">
							<Label>Purchase History</Label>
							<Button
								type="button"
								onClick={addHistoryItem}
								size="sm"
								variant="outline">
								<Plus className="h-4 w-4 mr-2" />
								Add Item
							</Button>
						</div>

						<div className="space-y-4">
							{history.length === 0 && (
								<p className="text-gray-500 text-sm">
									No history items. Click "Add Item" to add one or enter a User
									ID to load existing history.
								</p>
							)}
							{history.map((item, index) => (
								<div key={index} className="p-4 border rounded-lg space-y-3">
									<div className="flex items-center justify-between">
										<Badge variant="outline">Item {index + 1}</Badge>
										<Button
											type="button"
											onClick={() => removeHistoryItem(index)}
											size="sm"
											variant="ghost">
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
										<div>
											<Label htmlFor={`product-${index}`}>Product</Label>
											<Input
												id={`product-${index}`}
												value={item.product}
												onChange={(e) =>
													updateHistoryItem(index, "product", e.target.value)
												}
												placeholder="Product name"
												required
											/>
										</div>

										<div>
											<Label htmlFor={`category-${index}`}>Category</Label>
											<Input
												id={`category-${index}`}
												value={item.category}
												onChange={(e) =>
													updateHistoryItem(index, "category", e.target.value)
												}
												placeholder="Category"
												required
											/>
										</div>

										<div>
											<Label htmlFor={`price-${index}`}>Price ($)</Label>
											<Input
												id={`price-${index}`}
												type="number"
												value={item.price}
												onChange={(e) =>
													updateHistoryItem(
														index,
														"price",
														Number.parseFloat(e.target.value) || 0
													)
												}
												placeholder="0"
												min="0"
												step="0.01"
												required
											/>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Analyzing..." : "Get AI Recommendation"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
