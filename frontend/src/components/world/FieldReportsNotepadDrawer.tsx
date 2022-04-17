import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import Notepad from './FieldReportsNotepad';

function FieldReportsNotepadDrawer(props: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => any;
}) {
  const { isOpen, onClose, onSubmit } = props;
  return (
    <Drawer isOpen={isOpen} placement='bottom' size='xl' onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent style={{ minHeight: '50vh' }}>
        <DrawerCloseButton />
        <DrawerHeader>Notepad</DrawerHeader>
        <Notepad
          onSubmit={onSubmit}
          defaultText={`
# Hello From markdown!
These are your **notes** for the day
|item|amount|cost|
|-|-|-|
|bread|1 loaf|$2|
|milk|1 gallon|$3.50|
|eggs|1 dozen| $8.35|
*you can even code in your favorite language!*
\`\`\`javascript
const message = "hello coveytown";
console.log(message);
\`\`\`
`}
        />
      </DrawerContent>
    </Drawer>
  );
}

export default FieldReportsNotepadDrawer;