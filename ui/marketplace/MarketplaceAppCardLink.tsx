import { LinkOverlay, chakra } from '@chakra-ui/react';
import React from 'react';
import type { MouseEvent } from 'react';

import NextLink from 'ui/shared/NextLink';

type Props = {
  id: string;
  url: string;
  external?: boolean;
  title: string;
  onClick?: (event: MouseEvent, id: string) => void;
  className?: string;
};

const MarketplaceAppCardLink = ({ url, external, id, title, onClick, className }: Props) => {
  const handleClick = React.useCallback((event: MouseEvent) => {
    onClick?.(event, id);
  }, [ onClick, id ]);

  // TODO @tom2drum create LinkOverlay component
  return external ? (
    <LinkOverlay href={ url } marginRight={ 2 } className={ className } target="_blank">
      { title }
    </LinkOverlay>
  ) : (
    <NextLink href={{ pathname: '/apps/[id]', query: { id } }} passHref legacyBehavior>
      <LinkOverlay onClick={ handleClick } marginRight={ 2 } className={ className }>
        { title }
      </LinkOverlay>
    </NextLink>
  );
};

export default chakra(MarketplaceAppCardLink);
