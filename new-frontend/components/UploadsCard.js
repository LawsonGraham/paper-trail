import ArticleCard from './ArticleCard';

const UploadsCard = () => {
  return (
    <div class="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow ">
      <h5 class="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        🚀 Recent Uploads
      </h5>

      <hr class="h-px bg-gray-200 border-0 dark:bg-gray-700" />

      <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
        {Array(10)
          .fill(0)
          .map((item) => (
            <div className="sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
              <ArticleCard />
            </div>
          ))}
      </div>
    </div>
  );
};

export default UploadsCard;
