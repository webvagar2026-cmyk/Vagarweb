import HeroSection from '@/components/custom/HeroSection';
import { FeaturedExperiences } from '@/components/custom/FeaturedExperiences';
import { fetchExperiences } from '@/lib/data';
import { Metadata } from 'next';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Experiencias',
  description: 'Experiencias únicas en las sierras de Merlo.',
  openGraph: {
    title: 'Experiencias | Vagar Vacaciones',
    description: 'Experiencias únicas en las sierras de Merlo.',
    images: [{ url: '/nosotros/Galeria_2/Nosotros_experiencia_01.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Experiencias | Vagar Vacaciones',
    description: 'Experiencias únicas en las sierras de Merlo.',
    images: ['/nosotros/Galeria_2/Nosotros_experiencia_01.webp'],
  },
};

export default async function ExperienciasPage() {
  const experiences = await fetchExperiences();

  const zonaDeportiva = experiences.filter(
    (exp) => exp.category === 'Zona deportiva'
  );
  const residencial = experiences.filter((exp) => exp.category === 'Zona residencial');
  const zonaMontana = experiences.filter(
    (exp) => exp.category === 'Zona de montaña'
  );

  return (
    <main>
      <HeroSection
        videoSrc="/video-experiencias.mp4"
        title="Experiencias Únicas"
        subtitle="Vive momentos inolvidables en Vagar"
        showSearchBar={false}
      />
      <div className="container mx-auto px-4 py-12">
        <FeaturedExperiences
          title="Zona deportiva"
          experiences={zonaDeportiva}
          priority
        />
        <FeaturedExperiences title="Zona residencial" experiences={residencial} />
        <FeaturedExperiences
          title="Zona de montaña"
          experiences={zonaMontana}
        />
      </div>
    </main>
  );
}
