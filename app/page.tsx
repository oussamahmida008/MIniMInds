import Link from 'next/link';

export default function HomePage() {
    const levels = [
        {
            id: 1,
            title: "Reconnais les Objets !",
            emoji: "👁️",
            description: "Montre un objet à la webcam !",
            color: "bg-green-400",
            href: "/level-1",
            available: true
        },
        {
            id: 2,
            title: "Détection d'objets multiples & Bounding Boxes",
            emoji: "🎯",
            description: "L'IA encadre et reconnaît tous les objets !",
            color: "bg-indigo-400",
            href: "/level-2",
            available: true
        },
        {
            id: 4,
            title: "La Machine à Mots",
            emoji: "🤖",
            description: "Comprends comment ChatGPT parle !",
            color: "bg-pink-400",
            href: "/level-4",
            available: true
        },
        {
            id: 5,
            title: "Pourquoi l'IA se trompe ?",
            emoji: "🤔",
            description: "Découvrez pourquoi même les IA font des erreurs !",
            color: "bg-orange-400",
            href: "/level-5",
            available: true
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
            {/* Header */}
            <header className="bg-gradient-to-r from-purple-500 to-pink-500 py-6 shadow-lg">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">🤖 AI Learning Lab 🚀</h1>
                    <p className="text-xl text-white">Apprends l'IA en t'amusant !</p>
                </div>
            </header>

            {/* Main */}
            <main className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-5xl font-bold text-purple-700 mb-4">
                        Choisis ton Niveau !
                    </h2>
                    <p className="text-2xl text-gray-700">
                        Clique sur une carte pour jouer ! ✨
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {levels.map((level) => (
                        <Link
                            key={level.id}
                            href={level.available ? level.href : '#'}
                            className={`${level.color} rounded-3xl p-8 shadow-2xl transform transition hover:scale-110 ${!level.available && 'opacity-50 cursor-not-allowed'
                                }`}
                        >
                            <div className="text-center">
                                <div className="text-8xl mb-4">{level.emoji}</div>
                                <h3 className="text-2xl font-bold text-white mb-2">{level.title}</h3>
                                <p className="text-lg text-white/90 mb-4">{level.description}</p>
                                {level.available ? (
                                    <div className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold text-lg">
                                        Jouer ! 🎮
                                    </div>
                                ) : (
                                    <div className="bg-gray-300 text-gray-600 px-6 py-3 rounded-full font-bold text-lg">
                                        Bientôt ! 🔜
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
                    <div className="bg-white rounded-3xl p-6 shadow-xl text-center">
                        <div className="text-5xl mb-2">🤖</div>
                        <div className="text-3xl font-bold text-purple-600">5</div>
                        <div className="text-gray-700">Robots IA</div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 shadow-xl text-center">
                        <div className="text-5xl mb-2">🎮</div>
                        <div className="text-3xl font-bold text-blue-600">8</div>
                        <div className="text-gray-700">Jeux</div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 shadow-xl text-center">
                        <div className="text-5xl mb-2">✨</div>
                        <div className="text-3xl font-bold text-green-600">100%</div>
                        <div className="text-gray-700">Magique</div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-blue-500 to-purple-500 py-6 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-xl text-white font-bold">
                        🎉 Défi MiniMind 2025 🎉
                    </p>
                </div>
            </footer>
        </div>
    );
}
