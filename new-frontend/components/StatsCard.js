const StatsCard = () => {
  return (
    <div class="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow ">
      <h5 class="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        📝 Statistics
      </h5>

      <hr class="h-px bg-gray-200 border-0 dark:bg-gray-700" />

      <div class="flex flex-row justify-between py-4 gap-4">
        <div>
          <p class="font-normal text-gray-700 dark:text-gray-400">
            Total Contributors
          </p>
          <p>0</p>
        </div>
        <div>
          <p class="font-normal text-gray-700 dark:text-gray-400">
            Total Uploads
          </p>
          <p>0</p>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default StatsCard;
