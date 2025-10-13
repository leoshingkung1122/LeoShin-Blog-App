import LeoShin from "@/assets/ShuLing.jpg";

function HeroSection() {
  return (
    <main className="container px-4 py-8 lg:py-16 mx-auto">
      <div className="flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/3 mb-8 lg:mb-0 lg:pr-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Building <br className="hidden lg:block" />
            the Future, <br />
            One Commit at a Time,
          </h1>
          <p className="text-lg text-gray-500">
            Full-Stack Visionary with a MERN Core. Passionate about leveraging
            Next.js and TypeScript for scalable and high-performance web
            applications. Always eager to explore cutting-edge solutions like
            Serverless and Cloud technologies to deliver innovative user
            experiences.
          </p>
        </div>
        <img
          src={LeoShin}
          alt="Person is playing the arcade game"
          className="h-[530px] object-cover rounded-lg shadow-lg lg:w-1/3 mx-4 mb-8 lg:mb-0"
        />
        <div className="lg:w-1/3 lg:pl-8">
          <h2 className="text-xl font-semibold mb-2">-Developer & Explorer</h2>
          <h3 className="text-2xl font-bold mb-4">LeoShin</h3>
          <p className="text-gray-500 mb-4">
            Beyond the Terminal: I approach coding with the same curiosity I
            apply to my hobbies. Gaming trains my problem-solving skills and
            strategic thinking; Reading fuels my ability to absorb complex
            information quickly.
          </p>
          <p className="text-gray-500">
            In my downtime, Travelling broadens my perspective, just as vital for
            understanding global user needs.
          </p>
        </div>
      </div>
    </main>
  );
}

export default HeroSection;
