import { Web3Button } from '@web3modal/react';
import { useState, useEffect } from 'react';
import PublishModal from './PublishModal';
import { useAccount
 } from 'wagmi';
 import { TOKEN_ABI, TOKEN_ADDRESS } from '@/config';
 import { useContractReads, usePrepareContractWrite } from 'wagmi';


const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [verified, setVerified] = useState(false);

  const {address} = useAccount();

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      { address: TOKEN_ADDRESS, abi: TOKEN_ABI, functionName: 'totalUploads' },
      {
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'balanceOf',
        args: [
          address
        ]
      },
    ],
  });
  useEffect(() => {
    if (data && data[1].toNumber() > 0 ) {
      setVerified(true);
    }
    console.log(data);
  }, [verified, address])
  
  

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
            onClick={() => setShowModal((prev) => !prev)}
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Publish
          </button>
          <div>
            {verified ? <p class='text-black'>"Verified"</p> : <p class='text-black'>"Welcome, Visitor!"</p>}
          </div>
          {showModal && <PublishModal setShowModal={setShowModal} />}
          <Web3Button />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
