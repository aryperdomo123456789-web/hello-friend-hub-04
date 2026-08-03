import { createFileRoute } from "@tanstack/react-router";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-[#fcfbf8] text-foreground font-sans leading-relaxed">
      <div className="max-w-2xl space-y-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">CDN Voods Assets Backup</h1>
        <p className="whitespace-pre-line text-lg">
          https://github.com/aryperdomo123456789-web/cdnvoods-assets/tree/backup
          {"\n"}este projeto tu consegue trazer ele aqui pra lovable faver ele aqui
          {"\n"}com a linguegem aqui mudar pra linguagem daqui 
          {"\n"}e eu poder instalar vps como loudbalancer ??
          {"\n"}onde main cerebro e vps de musculo ??
        </p>
        <div className="pt-4">
          <img
            src="https://cdn.gpteng.co/blank-app-v1.svg"
            alt="CDN Voods Assets"
            className="mx-auto w-32 h-32 opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
