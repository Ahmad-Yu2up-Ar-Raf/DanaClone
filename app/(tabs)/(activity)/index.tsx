// app/(tabs)/(activity)/index.tsx - WITH SEARCH/FILTER

import * as React from 'react';
import { View } from '@/components/ui/fragments/shadcn-ui/view';
import { ScrollView } from 'react-native';
import {
  HistoryLink,
  HistoryCardProps,
} from '@/components/ui/fragments/custom-ui/card/history-card';
import ActivityCard from '@/components/ui/fragments/custom-ui/card/activity-card';
import { Wrapper } from '../(home)';
import FilterCard from '@/components/ui/fragments/custom-ui/card/filter-card';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import NotFound from '@/components/ui/fragments/custom-ui/card/not-found-card';

export default function Screen() {
  // ✅ State untuk search query dan filtered data
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredData, setFilteredData] = React.useState<HistoryCardProps[]>(HistoryLink);

  // ✅ Filter logic
  const handleSearch = React.useCallback((query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      // ✅ Empty query = show all data
      setFilteredData(HistoryLink);
      return;
    }

    // ✅ Filter berdasarkan label (case-insensitive)
    const filtered = HistoryLink.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredData(filtered);
  }, []);

  // ✅ Clear search
  const handleClearSearch = React.useCallback(() => {
    setSearchQuery('');
    setFilteredData(HistoryLink);
  }, []);

  return (
    <Wrapper showBackground={searchQuery.length === 0} edges={['bottom']} className="gap-0">
      {/* ✅ Pass search handlers ke FilterCard */}
      <FilterCard onSearch={handleSearch} onClear={handleClearSearch} searchQuery={searchQuery} />

      <View className="flex flex-col justify-between gap-0 px-2.5 py-1">
        {/* ✅ Show filtered data */}
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <ActivityCard
              key={`${item.label}-${index}`}
              Img={item.Img}
              label={item.label}
              date={item.date}
              amount={item.amount}
              status={item.status}
              isLastStep={index === filteredData.length - 1}
            />
          ))
        ) : (
          // ✅ Empty state when no results
          <NotFound
            title="  Tidak Ditemukan "
            deskripsi={`Tidak ada aktivitas ditemukan untuk "${searchQuery}"`}
          />
        )}
      </View>
    </Wrapper>
  );
}
