import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import {
	ShoppingCart,
	User,
	Brain,
	Search,
	CreditCard,
	History,
} from "lucide-react";
import {
	logPurchase,
	updateAgentMemory,
} from "../api/agent";
import { BuyerHistoryForm } from "../Components/buyer-history-form";
import { RecommendationDisplay } from "../Components/recommendation-display";
import { ProductSearch } from "../Components/product-search";
import { PurchaseSimulation } from "../Components/purchase-simulation";
import { MemoryDisplay } from "../Components/memory-display";
import {
	saveBuyerHistory,
	fetchBuyerHistory,
} from "../api/buyerHistoryService";
import { getRecommendation } from "../api/agent"; // This will be modified to accept BuyerProfile

export interface BuyerProfile {
	user_id: string;
	history: Array<{
		product: string;
		category: string;
		price: number;
	}>;
}

export interface Recommendation {
	category: string;
	justification: string;
	confidence: number;
}

export interface Product {
	id: string;
	name: string;
	category: string;
	price: number;
	description: string;
	rating: number;
}

export interface PurchaseResult {
	success: boolean;
	transaction_id: string;
	product: Product;
	message: string;
}

export default function ShoppingAssistant() {
	const [currentStep, setCurrentStep] = useState<
		"input" | "recommendation" | "search" | "purchase" | "complete"
	>("input");
	const [buyerProfile, setBuyerProfile] = useState<BuyerProfile | null>(null);
	const [recommendation, setRecommendation] = useState<Recommendation | null>(
		null
	);
	const [searchResults, setSearchResults] = useState<Product[]>([]);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [purchaseResult, setPurchaseResult] = useState<PurchaseResult | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(false);

	const [initialLoadedHistory, setInitialLoadedHistory] = useState<
		BuyerProfile["history"] | null
	>(null);
	const [inputUserId, setInputUserId] = useState("A123"); // Default user ID

	useEffect(() => {
		const loadHistory = async () => {
			if (currentStep === "input" && inputUserId) {
				setIsLoading(true);
				try {
					console.log(`Fetching history for user: ${inputUserId}`);
					const historyData = await fetchBuyerHistory(inputUserId);
					setInitialLoadedHistory(historyData);
					console.log("History loaded:", historyData);
				} catch (err) {
					console.error("Error loading buyer history:", err);
					setInitialLoadedHistory([]); // On error, allow user to input new history
				} finally {
					setIsLoading(false);
				}
			}
		};
		loadHistory();
	}, [inputUserId, currentStep]);

	const handleProfileSubmit = async (profile: BuyerProfile) => {
		console.log("Starting submit flow with profile:", profile);
		setIsLoading(true);
		setBuyerProfile(profile);

		try {
			console.log("Saving history to Spring Boot...");
			console.log("History saved");

			console.log("Requesting recommendation from agent...");
			const { category, reason, products } = await getRecommendation(profile);
			console.log("Recommendation received:", products);

			const rec: Recommendation = {
				category,
				justification: reason,
				confidence: 0.8,
			};
      setRecommendation(rec);
      setSearchResults(products);
			setCurrentStep("recommendation");
		} catch (err: any) {
			console.error("Error in submit flow:", err);
			alert(
				`Error: ${err.message || err.detail || "An unknown error occurred"}`
			);
		} finally {
			setIsLoading(false);
			console.log("⏹️ Submit flow complete");
		}
	};

	const handleSearchProducts = async () => {
		if (!recommendation) return;

		setIsLoading(true);
		setCurrentStep("search");

		try {
			await new Promise((resolve) => setTimeout(resolve, 1500));

		} catch (error) {
			console.error("Error searching products:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleProductSelect = (product: Product) => {
		setSelectedProduct(product);
		setCurrentStep("purchase");
	};

	const handlePurchase = async () => {
		if (!selectedProduct || !buyerProfile) return;

		setIsLoading(true);

		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const result: PurchaseResult = {
				success: true,
				transaction_id: `TXN_${Date.now()}`,
				product: selectedProduct,
				message: `Successfully purchased ${selectedProduct.name} for $${selectedProduct.price}`,
			};

			setPurchaseResult(result);

      const purchaseItem = {
            product: selectedProduct.name,
            category: selectedProduct.category,
            price: selectedProduct.price,
          };
        
      await logPurchase(buyerProfile.user_id, purchaseItem);
        
      await updateAgentMemory(buyerProfile.user_id, purchaseItem);
        
			const updatedProfile: BuyerProfile = {
				...buyerProfile,
				history: [
					...buyerProfile.history,
					{
						product: selectedProduct.name,
						category: selectedProduct.category,
						price: selectedProduct.price,
					},
				],
			};
			setBuyerProfile(updatedProfile);

			setCurrentStep("complete");
		} catch (error) {
			console.error("Error processing purchase:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const resetFlow = () => {
		setCurrentStep("input");
		setBuyerProfile(null);
		setRecommendation(null);
		setSearchResults([]);
		setSelectedProduct(null);
		setPurchaseResult(null);
		setInitialLoadedHistory(null);
		setInputUserId("A123");
	};

	const getStepIcon = (step: string) => {
		switch (step) {
			case "input":
				return <User className="h-5 w-5" />;
			case "recommendation":
				return <Brain className="h-5 w-5" />;
			case "search":
				return <Search className="h-5 w-5" />;
			case "purchase":
				return <CreditCard className="h-5 w-5" />;
			case "complete":
				return <History className="h-5 w-5" />;
			default:
				return null;
		}
	};

	const steps = [
		{ id: "input", label: "Buyer Profile", completed: !!buyerProfile },
		{
			id: "recommendation",
			label: "AI Recommendation",
			completed: !!recommendation,
		},
		{
			id: "search",
			label: "Product Search",
			completed: searchResults.length > 0,
		},
		{ id: "purchase", label: "Purchase", completed: !!selectedProduct },
		{ id: "complete", label: "Complete", completed: !!purchaseResult },
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-8">
					<div className="flex items-center justify-center gap-2 mb-4">
						<ShoppingCart className="h-8 w-8 text-indigo-600" />
						<h1 className="text-4xl font-bold text-gray-900">
							AI Shopping Assistant
						</h1>
					</div>
					<p className="text-lg text-gray-600">
						Personalized product recommendations powered by AI
					</p>
				</div>

				{/* Progress Steps */}
				<Card className="mb-8">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							{steps.map((step, index) => (
								<div key={step.id} className="flex items-center">
									<div
										className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
											currentStep === step.id
												? "bg-indigo-100 text-indigo-700"
												: step.completed
												? "bg-green-100 text-green-700"
												: "bg-gray-100 text-gray-500"
										}`}>
										{getStepIcon(step.id)}
										<span className="font-medium">{step.label}</span>
									</div>
									{index < steps.length - 1 && (
										<div
											className={`w-8 h-0.5 mx-2 ${
												step.completed ? "bg-green-300" : "bg-gray-300"
											}`}
										/>
									)}
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2 space-y-6">
						{currentStep === "input" && (
							<BuyerHistoryForm
								onSubmit={handleProfileSubmit}
								isLoading={isLoading}
								initialUserId={inputUserId} // Pass the userId for the form
								initialHistory={initialLoadedHistory} // Pass the fetched history for pre-filling
								// You might also want a way for BuyerHistoryForm to update inputUserId state
								// This would require changing BuyerHistoryForm to emit userId changes.
								// For now, we'll assume the form's internal userId state is used on submit.
							/>
						)}

						{currentStep === "recommendation" && recommendation && (
							<RecommendationDisplay
								recommendation={recommendation}
								onNext={handleSearchProducts}
								isLoading={isLoading}
							/>
						)}

						{currentStep === "search" && (
							<ProductSearch
								products={searchResults}
								onProductSelect={handleProductSelect}
								isLoading={isLoading}
							/>
						)}

						{currentStep === "purchase" && selectedProduct && (
							<PurchaseSimulation
								product={selectedProduct}
								onPurchase={handlePurchase}
								isLoading={isLoading}
							/>
						)}

						{currentStep === "complete" && purchaseResult && (
							<Card>
								<CardHeader>
									<CardTitle className="text-green-600">
										Purchase Complete!
									</CardTitle>
									<CardDescription>
										Your order has been processed successfully
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="p-4 bg-green-50 rounded-lg">
											<p className="text-green-800 font-medium">
												{purchaseResult.message}
											</p>
											<p className="text-green-600 text-sm">
												Transaction ID: {purchaseResult.transaction_id}
											</p>
										</div>
										<Button onClick={resetFlow} className="w-full">
											Start New Session
										</Button>
									</div>
								</CardContent>
							</Card>
						)}
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{buyerProfile && (
							<MemoryDisplay
								profile={buyerProfile}
								recommendation={recommendation}
								purchaseResult={purchaseResult}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
