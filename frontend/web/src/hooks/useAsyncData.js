import { useCallback, useEffect, useState } from 'react';

export function useAsyncData(loader, dependencies, initialData) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const nextData = await loader();
      setData(nextData);
    } catch (loaderError) {
      setError(loaderError instanceof Error ? loaderError.message : 'Có lỗi khi tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload, setData };
}
