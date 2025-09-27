import { Metadata } from 'next'

interface MenuPageProps {
    params: {
        slug: string
    }
}

export const metadata: Metadata = {
    title: 'Menu Editor',
    description: 'Edit your menu structure',
}

export default function MenuPage({ params }: MenuPageProps) {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">
                Menu Editor: {params.slug}
            </h1>
            <p className="text-gray-600">
                Menu editor interface will be implemented here.
            </p>
        </div>
    )
}
