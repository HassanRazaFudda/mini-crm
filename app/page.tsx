import { getLeads } from '@/app/actions';
import { LeadForm } from '@/app/components/LeadForm';
import { LeadCard } from '@/app/components/LeadCard';

export default async function Home() {
  const leads = await getLeads();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">CRM Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your leads and customer relationships</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{leads.length}</p>
              <p className="text-sm text-gray-500">Total Leads</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
          {/* Form - Sticky on larger screens */}
          <div className="lg:sticky lg:top-6 lg:h-fit">
            <LeadForm />
          </div>

          {/* Leads List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {leads.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                  <p className="text-gray-500">No leads yet. Add your first lead to get started!</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Your Leads</h2>
                    <p className="text-sm text-gray-500 mt-1">Click on a lead to manage it</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    {leads.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
