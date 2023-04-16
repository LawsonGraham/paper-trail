import { Web3Button } from '@web3modal/react';

const Navbar = () => {
  return (
    <nav class="bg-white border-gray-200 dark:bg-gray-900">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" class="flex items-center">
          <img src="favicon.png" class="h-8 mr-3" alt="PaperTrails" />
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            paper trail
          </span>
        </a>
        <div class="flex md:order-2 gap-3">
          <button
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Publish
          </button>

          <Web3Button />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
