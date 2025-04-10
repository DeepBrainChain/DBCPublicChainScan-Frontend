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
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Skeleton,
} from '@chakra-ui/react';
import { useTimeoutFn } from '@reactuses/core';
import React from 'react';
import { BsFilter } from 'react-icons/bs';
import { useTranslation } from 'next-i18next';

const mymachineSearchTop = () => {
  const [isPending, start] = useTimeoutFn(() => {}, 2000, { immediate: true });
  const { t } = useTranslation('common');

  return (
    <Skeleton isLoaded={!isPending}>
      <div className="flex items-center justify-between">
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
            <Input type="tel" placeholder={t('withdrawDialog_searchKeywords')} />
          </InputGroup>
        </div>

        {/* <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-x-3 ">
            <Button variant="outline" size="sm">
              Total Pages：666
            </Button>
            <Button size="sm">
              <FaAngleLeft />
            </Button>

            <Button variant="ghost" size="sm">
              1
            </Button>
            <Button size="sm">
              <FaAngleRight />
            </Button>
          </div>
        </div> */}
      </div>
    </Skeleton>
  );
};

export default mymachineSearchTop;
