import Card from '../shared/Card'

const RecommendedSection = ({ items = [], color = 'indigo', title, onItemClick, hideCardButton = false }) => {
    if (!items || items.length === 0) return null

    return (
        <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900">{title}</h2>
                <div className="text-sm text-gray-500 font-semibold">{items.length} picks for you</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {items.map((club) => (
                    <div key={club.id} onClick={() => onItemClick?.(club)} className="cursor-pointer">
                        <Card item={club} color={color} hideButton={hideCardButton} />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default RecommendedSection

