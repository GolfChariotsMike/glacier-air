const projects = [
  {
    title: "Fremantle Office AC Fitout",
    category: "Commercial Air Conditioning",
    images: [
      "https://glacierair.com.au/wp-content/uploads/2022/10/for-WEB-152-High-St-Fremantle-19.jpeg",
      "https://glacierair.com.au/wp-content/uploads/2022/10/for-WEB-152-High-St-Fremantle-7.jpeg",
      "https://glacierair.com.au/wp-content/uploads/2022/10/for-WEB-152-High-St-Fremantle-13.jpeg",
      "https://glacierair.com.au/wp-content/uploads/2022/10/for-WEB-152-High-St-Fremantle-16.jpeg",
    ],
    description:
      "Full air conditioning fitout for a multi-tenancy commercial office in Fremantle. Design, supply and installation.",
    featured: true,
  },
  {
    title: "Nikola Estate Barn AC",
    category: "Winery Refrigeration",
    images: [
      "https://glacierair.com.au/wp-content/uploads/2022/10/received_224653333086044.jpeg",
      "https://glacierair.com.au/wp-content/uploads/2022/10/received_319472319685046.jpeg",
      "https://glacierair.com.au/wp-content/uploads/2022/10/received_1254918434986995.jpeg",
      "https://glacierair.com.au/wp-content/uploads/2022/10/319472319685046-2.jpeg",
    ],
    description:
      "Specialised winery barn refrigeration and air conditioning for Nikola Estate in the Great Southern region.",
    featured: false,
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 bg-[#0a0f1e]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Our Work
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Recent Projects
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A snapshot of our recent installations across Perth and regional WA.
          </p>
        </div>

        <div className="space-y-12">
          {projects.map((project, pi) => (
            <div
              key={project.title}
              className={`grid lg:grid-cols-2 gap-8 items-center ${
                pi % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image grid */}
              <div className={`grid grid-cols-2 gap-3 ${pi % 2 === 1 ? "lg:order-2" : ""}`}>
                {project.images.slice(0, 4).map((img, i) => (
                  <div
                    key={img}
                    className={`rounded-xl overflow-hidden ${
                      i === 0 && project.featured ? "col-span-2 h-52" : "h-36"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`${project.title} ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className={pi % 2 === 1 ? "lg:order-1" : ""}>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wide mb-4">
                  {project.category}
                </span>
                <h3 className="text-3xl font-bold text-white mb-4">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed mb-6">
                  {project.description}
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Enquire about a similar project →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
