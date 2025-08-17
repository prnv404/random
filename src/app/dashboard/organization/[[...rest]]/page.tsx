
import { OrganizationProfile } from '@clerk/nextjs';

const OrganizationProfilePage = () => {
  return (
    <div className="flex items-start justify-center h-full pt-10">
      <OrganizationProfile routing="path" path="/dashboard/organization" />
    </div>
  );
};

export default OrganizationProfilePage;
