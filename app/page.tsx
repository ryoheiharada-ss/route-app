import { RouteSearchForm } from "@/route-search/form";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">経路検索</h1>
        <RouteSearchForm />
      </div>
    </div>
  );
}
