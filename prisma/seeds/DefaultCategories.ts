import { Category } from "@prisma/client";
import { DefaultOmission } from "../seed";

export const DefaultCategories: Omit<Category, DefaultOmission>[] = [
  {
    name: "Tecnologia",
    description:
      "Cursos sobre programação, desenvolvimento de software, redes e segurança da informação.",
  },
  {
    name: "Design",
    description:
      "Cursos sobre design gráfico, UX/UI, edição de vídeo e fotografia.",
  },
  {
    name: "Marketing Digital",
    description:
      "Cursos sobre SEO, mídias sociais, branding e publicidade online.",
  },
  {
    name: "Negócios e Empreendedorismo",
    description:
      "Cursos sobre gestão empresarial, startups, finanças e liderança.",
  },
  {
    name: "Idiomas",
    description:
      "Cursos para aprender e aprimorar diferentes idiomas como inglês, espanhol e francês.",
  },
  {
    name: "Saúde e Bem-estar",
    description:
      "Cursos sobre nutrição, exercícios físicos, meditação e desenvolvimento pessoal.",
  },
  {
    name: "Ciência e Engenharia",
    description:
      "Cursos sobre física, química, biologia, matemática e engenharia.",
  },
  {
    name: "Música e Artes",
    description:
      "Cursos sobre instrumentos musicais, teoria musical, pintura e artes plásticas.",
  },
  {
    name: "Culinária e Gastronomia",
    description:
      "Cursos sobre técnicas de cozinha, confeitaria, culinária internacional e enologia.",
  },
  {
    name: "Educação",
    description:
      "Cursos voltados para professores, pedagogia e metodologias de ensino.",
  },
];
