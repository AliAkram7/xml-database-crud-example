'use client'
import { Container, Group, ActionIcon, Button } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons-react';
import classes from './footer.module.css';
import { useRouter } from 'next/navigation';



export function Footer() {
    const router  =  useRouter()
  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Button variant='light' 
            onClick={()=>{
                router.push('/')
            }}
        >
            Xml Crud App
        </Button>
        <Group gap={0} className={classes.links} justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandTwitter style={{ width: 22, height: 22 }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandYoutube style={{ width: 22, height: 22 }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandInstagram style={{ width: 22, height: 22 }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </div>
  );
}