import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white">
            <h2 className="text-4xl font-bold mb-4">Not Found</h2>
            <p className="text-zinc-400 mb-8">Could not find requested resource</p>
            <Link href="/" className="px-4 py-2 bg-orange-500 rounded-full hover:bg-orange-600 transition">
                Return Home
            </Link>
        </div>
    );
}
