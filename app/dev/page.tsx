import { DomainProjects } from '@/components/domain-projects';

export default function DevPage() {
  return (
    <DomainProjects
      domain="dev"
      heading="DEV PROJECTS"
      subheading="Compilers, tools, editors and backend services. Filter by stack using the chips below."
    />
  );
}
