import {
  InputGroup,
  Input,
  InputLeftAddon,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Button,
  PopoverArrow,
  PopoverCloseButton,
  Skeleton,
} from '@chakra-ui/react';
import { useTimeoutFn } from '@reactuses/core';
import React, { useState } from 'react';
import { BsFilter } from 'react-icons/bs';
import { useTranslation } from 'next-i18next';
import Pagination from '../../../ui/pagination';

const mymachineSearchTop = ({ currentPage, totalItems, pageSize, onPageChange, searchH }) => {
  const [isPending] = useTimeoutFn(() => {}, 2000, { immediate: true });
  const { t } = useTranslation('common');
  const handleChange = (event) => searchH(event.target.value);
  return (
    <Skeleton isLoaded={!isPending}>
      <div className="flex items-center gap-4 flex-wrap justify-between">
        <div className="flex-1">
          <InputGroup size="sm">
            <InputLeftAddon>
              <Popover>
                <PopoverTrigger>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <BsFilter size={24} />
                    <Text>Filter</Text>
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Confirmation!</PopoverHeader>
                  <PopoverBody> milkshake?</PopoverBody>
                </PopoverContent>
              </Popover>
            </InputLeftAddon>
            <Input onChange={handleChange} type="tel" placeholder={t('withdrawDialog_searchKeywords')} />
          </InputGroup>
        </div>

        <Pagination currentPage={currentPage} totalItems={totalItems} pageSize={pageSize} onPageChange={onPageChange} />
      </div>
    </Skeleton>
  );
};

export default mymachineSearchTop;
