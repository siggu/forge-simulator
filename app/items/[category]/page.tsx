import { ItemCard } from "@/components/item-card"
import { items } from "@/lib/items-data"
import Link from "next/link"

export default function ItemsPage({ params }: { params: { category: string } }) {
  const categoryItems = items.filter((item) => item.category === params.category)

  const categoryTitleMap: Record<string, string> = {
    hero: "영웅 무기",
    legendary: "전설 무기",
    mortal: "필멸 무기",
  }

  const categoryColorMap: Record<string, string> = {
    hero: "text-purple-400",
    legendary: "text-yellow-400",
    mortal: "text-red-400",
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="container mx-auto max-w-7xl">
        <Link href="/" className="text-blue-400 hover:underline mb-4 inline-block">
          ← 메인으로 돌아가기
        </Link>

        <h1 className={`text-4xl font-bold my-8 ${categoryColorMap[params.category]}`}>
          {categoryTitleMap[params.category]}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoryItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

