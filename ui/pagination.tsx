import React, { useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useTranslation } from 'next-i18next';

function SimplePagination({ currentPage, totalItems, pageSize, onPageChange }) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const { t } = useTranslation('common');
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  useEffect(() => {
    console.log(currentPage, pageSize, totalPages);
  }, [currentPage, pageSize]);

  return (
    <div className="flex-1 flex justify-end">
      <div className="flex items-center gap-x-3 ">
        {/* 共多少条 */}
        <Button variant="outline" size="sm" border={0}>
          {/* 共 {totalItems} 条 */}
          {t('deeplink.totalItems', { count: totalItems })} {/* 共 XX 条 */}
        </Button>
        {/* 上一页 */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
        >
          <FaChevronLeft />
        </Button>
        {/* 当前页 */}
        <Button variant="outline" border={0} size="sm">
          {/* 第 {currentPage} 页 */}
          {t('deeplink.currentPage', { page: currentPage })} {/* 共 XX 条 */}
        </Button>
        {/* 下一页 */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
        >
          <FaChevronRight />
        </Button>
      </div>
    </div>
  );
}

export default SimplePagination;
