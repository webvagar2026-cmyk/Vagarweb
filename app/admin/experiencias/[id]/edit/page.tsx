import { fetchExperienceById } from '@/lib/data';
import { ExperienceForm } from '@/components/custom/ExperienceForm';
import { notFound } from 'next/navigation';

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const experience = await fetchExperienceById(id);

  if (!experience) {
    notFound();
  }

  // The ExperienceForm now expects `what_to_know` as an array of strings.
  let whatToKnowItems: string[] = [];
  if (experience.what_to_know) {
    if (Array.isArray(experience.what_to_know)) {
      whatToKnowItems = experience.what_to_know;
    } else if (typeof experience.what_to_know === 'string') {
      try {
        const parsed = JSON.parse(experience.what_to_know);
        if (Array.isArray(parsed)) {
          whatToKnowItems = parsed;
        }
      } catch (error) {
        console.error('Failed to parse what_to_know string:', error);
      }
    }
  }

  const transformedExperience = {
    ...experience,
    what_to_know: whatToKnowItems,
    // The form also expects images as an array of objects with a `url` property.
    images: experience.gallery_images.map(img => ({ url: img.url })),
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Editar Experiencia</h1>
      <ExperienceForm defaultValues={transformedExperience} />
    </div>
  );
}
