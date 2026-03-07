import { getRepository } from '../repositories/index.js';
import { createTravelService } from '../services/travel-service.js';

async function main() {
  const repository = getRepository();
  const travelService = createTravelService(repository);
  const result = await travelService.bootstrapDemoData();

  console.log(
    JSON.stringify(
      {
        message: 'Đã seed demo data cho VietWander backend.',
        databaseMode: repository.mode,
        result,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error('[seed:demo] thất bại', error);
  process.exitCode = 1;
});
