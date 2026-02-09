import React from 'react';
import { View, Text, Dimensions } from 'react-native';

import { Wrapper } from '../(home)';
import { Image } from '@/components/ui/fragments/shadcn-ui/image';

import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import { Icon } from '@/components/ui/fragments/shadcn-ui/icon';
import { ChevronDown } from 'lucide-react-native';
import FilterCard from '@/components/ui/fragments/custom-ui/card/filter-card';
import { cn } from '@/lib/utils';
import NotFound from '@/components/ui/fragments/custom-ui/card/not-found-card';

interface WalletProps {
  title: string;
  totalCard?: string;
  imageSource?: any;

  dotCollor?: string;
  Wallet_Height?: number;
}
const width = Dimensions.get('window').width;

const walletData: WalletProps[] = [
  {
    dotCollor: 'bg-green-500',
    title: 'Dompet Digital',
    totalCard: '5 KARTU',
    imageSource: require('@/assets/images/wallet/wallet-1.png'),
  },
  {
    title: 'Metode Pembayaran',
    totalCard: '4 KARTU',
    imageSource: require('@/assets/images/wallet/wallet-2.png'),
  },
];

const Index = () => {
  const Wallet_Height = (width / 7.5) * 4.4;
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredData, setFilteredData] = React.useState<WalletProps[]>(walletData);

  // ✅ Filter logic
  const handleSearch = React.useCallback((query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      // ✅ Empty query = show all data
      setFilteredData(walletData);
      return;
    }

    // ✅ Filter berdasarkan label (case-insensitive)
    const filtered = walletData.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredData(filtered);
  }, []);

  // ✅ Clear search
  const handleClearSearch = React.useCallback(() => {
    setSearchQuery('');
    setFilteredData(walletData);
  }, []);
  return (
    <Wrapper showBackground={searchQuery.length === 0} edges={['bottom']} className="gap-10">
      <FilterCard
        placeholder="Cari Dompet..."
        onSearch={handleSearch}
        onClear={handleClearSearch}
        searchQuery={searchQuery}
      />
      {filteredData.length > 0 ? (
        filteredData.map((item, index) => (
          <View key={index} className="relative flex-1 gap-4">
            <View className="w-full flex-row items-center justify-between px-5">
              <Text className="text-sm font-semibold uppercase text-muted-foreground/80">
                {item.title}
              </Text>
              <View className="flex-row items-center gap-2 text-sm font-semibold text-muted-foreground/80">
                {item.dotCollor && (
                  <View className={cn('size-2 h-2 rounded-full', item.dotCollor)} />
                )}
                <Text className="text-sm font-semibold text-muted-foreground/80">
                  {item.totalCard}
                </Text>
              </View>
            </View>
            <Image
              source={item.imageSource}
              width={width}
              height={item.Wallet_Height || Wallet_Height}
              contentFit="contain"
              showLoadingIndicator={true}
              showErrorFallback={true}
            />
            <Button
              variant={'outline'}
              size={'sm'}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 translate-y-1/2 items-center rounded-full">
              <Icon as={ChevronDown} size={18} />
              <Text>Buka</Text>
            </Button>
          </View>
        ))
      ) : (
        <NotFound
          title="  Tidak Ditemukan "
          deskripsi={`Tidak ada dompet ditemukan untuk "${searchQuery}"`}
        />
      )}
    </Wrapper>
  );
};

export default Index;
