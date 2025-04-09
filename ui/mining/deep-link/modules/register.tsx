import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  Button,
  useToast,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Modal,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useContractActions } from '../hooks/stake-before';

function registerC({ setIsLastStep, machineId }: { setIsLastStep: any; machineId: any }) {
  const { t } = useTranslation('common');
  const { register } = useContractActions(machineId);

  // 点击开始注册
  const startRegister = async () => {
    const res: any = await register();
    if (res.code !== 0) {
      throw new Error(res.message || t('cpudbc_register_interface_failed'));
    } else {
      setIsLastStep(true);
    }
  };

  return (
    <ModalBody pb={6} className="bg-gradient-to-b ">
      <div className="flex flex-col gap-6 p-4">
        {/* 标题区域 - 添加图标和渐变文字 */}
        <div className="flex items-center gap-3">
          <Text fontSize="lg">在质押之前请先完成注册</Text>
        </div>

        {/* 提示信息 - 添加辅助说明 */}
        <Text fontSize="sm" className="leading-relaxed">
          注册只需几秒钟，即可解锁质押功能并开始赚取收益。
        </Text>

        {/* 按钮区域 - 增强交互效果 */}
        <Button
          onClick={startRegister}
          colorScheme="blue"
          size="lg"
          className="w-full md:w-auto hover:shadow-lg transition-all duration-300"
        >
          立即注册
        </Button>
      </div>
    </ModalBody>
  );
}

export default registerC;
