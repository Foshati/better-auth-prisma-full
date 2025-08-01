import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell } from 'lucide-react';
import Link from 'next/link';

export default function NavbarDashboard() {
  return (
    <div className='flex border-b p-4 justify-between items-center'>
      <div>
        <SidebarTrigger />
      </div>
      <div className='flex justify-center items-center gap-4'>
        <Link href='/'>
          {' '}
          <Button variant='link'>Home</Button>
        </Link>
        <Bell className='size-5' />
      </div>
    </div>
  );
}
