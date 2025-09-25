"use client";

import { useState } from "react";

export default function SyncPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    message: string;
    synced?: number;
    errors?: string[];
  } | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);

    try {
      const response = await fetch("/api/sync-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      setSyncResult(result);
    } catch (error) {
      setSyncResult({
        success: false,
        message: `Sync failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
        errors: [error instanceof Error ? error.message : String(error)],
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Shopify to Sanity Sync
          </h1>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                How it works
              </h2>
              <p className="text-blue-800">
                This tool syncs all products from your Shopify store to Sanity
                CMS. Your website will then pull products from Sanity instead of
                directly from Shopify, giving you better performance and content
                management capabilities.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-yellow-900 mb-2">
                Before you start
              </h2>
              <ul className="text-yellow-800 space-y-1">
                <li>• Make sure your Sanity project is configured correctly</li>
                <li>• Ensure your Shopify API credentials are working</li>
                <li>
                  • This will overwrite existing products with the same Shopify
                  ID
                </li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isSyncing
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isSyncing ? "Syncing..." : "Start Sync"}
              </button>

              <button
                onClick={() => (window.location.href = "/api/sync-products")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Test API Endpoint
              </button>
            </div>

            {syncResult && (
              <div
                className={`rounded-lg p-4 ${
                  syncResult.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    syncResult.success ? "text-green-900" : "text-red-900"
                  }`}
                >
                  {syncResult.success ? "✅ Sync Successful" : "❌ Sync Failed"}
                </h3>
                <p
                  className={`mb-2 ${
                    syncResult.success ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {syncResult.message}
                </p>
                {syncResult.synced !== undefined && (
                  <p
                    className={`text-sm ${
                      syncResult.success ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    Products synced: {syncResult.synced}
                  </p>
                )}
                {syncResult.errors && syncResult.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-red-800 mb-1">
                      Errors:
                    </p>
                    <ul className="text-sm text-red-700 space-y-1">
                      {syncResult.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Next Steps
              </h3>
              <ol className="text-gray-700 space-y-1">
                <li>
                  1. Run the sync to populate Sanity with your Shopify products
                </li>
                <li>
                  2. Set up webhooks in Shopify to automatically sync when
                  products change
                </li>
                <li>
                  3. Configure your website to pull products from Sanity instead
                  of Shopify
                </li>
                <li>4. Test the product display on your website</li>
              </ol>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Webhook Setup
              </h3>
              <p className="text-gray-700 mb-2">
                To enable automatic syncing when products change in Shopify, add
                this webhook URL:
              </p>
              <code className="bg-gray-200 px-2 py-1 rounded text-sm">
                {typeof window !== "undefined"
                  ? window.location.origin
                  : "https://your-domain.com"}
                /api/webhooks/shopify
              </code>
              <p className="text-sm text-gray-600 mt-2">
                Configure it for these events: products/create, products/update,
                products/delete
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
