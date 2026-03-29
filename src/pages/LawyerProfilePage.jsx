import ProfileUpdateTab from '../components/lawyer/ProfileUpdateTab';

const LawyerProfilePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ProfileUpdateTab />
            </div>
        </div>
    );
};

export default LawyerProfilePage;
