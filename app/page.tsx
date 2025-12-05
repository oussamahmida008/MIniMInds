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
            <header className="bg-gradient-to-r from-purple-500 to-pink-500 py-12 shadow-xl">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">🤖 AI Learning Lab 🚀</h1>
                    <p className="text-2xl md:text-3xl text-white/95">Apprends l'IA en t'amusant !</p>
                </div>
            </header>

            {/* Main */}
            <main className="container mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-bold text-purple-700 mb-6">
                        Choisis ton Niveau !
                    </h2>
                    <p className="text-2xl md:text-3xl text-gray-700">
                        Clique sur une carte pour jouer ! ✨
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto mb-20">
                    {levels.map((level) => (
                        <Link
                            key={level.id}
                            href={level.available ? level.href : '#'}
                            className={`${level.color} rounded-3xl p-10 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl ${!level.available && 'opacity-50 cursor-not-allowed'
                                }`}
                        >
                            <div className="text-center">
                                <div className="text-9xl mb-6">{level.emoji}</div>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{level.title}</h3>
                                <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">{level.description}</p>
                                {level.available ? (
                                    <div className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-xl hover:bg-purple-50 transition-colors">
                                        Jouer ! 🎮
                                    </div>
                                ) : (
                                    <div className="bg-gray-300 text-gray-600 px-8 py-4 rounded-full font-bold text-xl">
                                        Bientôt ! 🔜
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="bg-white rounded-3xl p-8 shadow-2xl text-center transform transition-all duration-300 hover:scale-105">
                        <div className="text-6xl mb-4">🤖</div>
                        <div className="text-4xl font-bold text-purple-600 mb-2">5</div>
                        <div className="text-lg text-gray-700 font-medium">Robots IA</div>
                    </div>
                    <div className="bg-white rounded-3xl p-8 shadow-2xl text-center transform transition-all duration-300 hover:scale-105">
                        <div className="text-6xl mb-4">🎮</div>
                        <div className="text-4xl font-bold text-blue-600 mb-2">8</div>
                        <div className="text-lg text-gray-700 font-medium">Jeux</div>
                    </div>
                    <div className="bg-white rounded-3xl p-8 shadow-2xl text-center transform transition-all duration-300 hover:scale-105">
                        <div className="text-6xl mb-4">✨</div>
                        <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
                        <div className="text-lg text-gray-700 font-medium">Magique</div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-blue-500 to-purple-500 py-10 mt-20">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-2xl md:text-3xl text-white font-bold">
                        🎉 Défi MiniMind 2025 🎉
                    </p>
                </div>
            </footer>
        </div>
    );
}
