import { ConceptExplainer } from "@/components/Features/KangJelasin";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Selamat Datang di Jembatan Keahlian 🚀
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Navigator pribadi Anda untuk mencapai karir impian.
          </p>
        </div>

        {/* Di sini kita akan menambahkan komponen lain nanti (Skill Gap, Learning Path) */}

        {/* Fitur #3: Penerjemah Konsep */}
        <ConceptExplainer />
      </div>
    </main>
  );
}
