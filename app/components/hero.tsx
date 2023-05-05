import { Link } from "@remix-run/react";

const Hero = () => {
  return (
    <div className="bg-white dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto py-16 sm:py-24 lg:py-32 lg:max-w-none">
          <h2 className="text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
            <span className="block">Data to enrich your</span>
            <span className="block text-emerald-400">online business</span>
          </h2>
          <p className="mt-6 text-xl text-zinc-500 dark:text-zinc-400 max-w-3xl">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
            Lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
            fugiat.
          </p>
          <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
            <div className="rounded-md shadow">
              <Link
                to="/login"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-500 hover:bg-emerald-600 md:py-4 md:text-lg md:px-10"
              >
                Get started
              </Link>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <Link
                to="admin"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-emerald-600 bg-emerald-50 hover:bg-emerald-100 md:py-4 md:text-lg md:px-10"
              >
                Live demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
