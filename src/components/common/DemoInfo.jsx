import React, { useState } from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Info, Eye, EyeOff } from 'lucide-react';

const DemoInfo = () => {
  const [visible, setVisible] = useState(false);

  if (process.env.NODE_ENV === 'production') {
    return null; // Hide in production
  }

  const demoAccounts = [
    {
      key: '1',
      type: 'Sinh viên',
      email: 'student@gmail.com',
      username: 'student1',
      password: '123456',
      role: 'student'
    },
    {
      key: '2',
      type: 'Trường ĐH',
      email: 'admin@hust.edu.vn',
      username: 'hust_admin',
      password: '123456',
      role: 'university'
    },
    {
      key: '3',
      type: 'Admin Hệ thống',
      email: 'admin@system.com',
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    }
  ];

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'student': return 'default';
      case 'university': return 'secondary';
      case 'admin': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => setVisible(!visible)}
        className="mb-2"
        size="sm"
      >
        {visible ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
        Demo Accounts
      </Button>
      
      {visible && (
        <Card className="w-96 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Info className="h-4 w-4" />
              <span>Demo Accounts (Development)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Loại tài khoản</TableHead>
                    <TableHead className="text-xs">Email</TableHead>
                    <TableHead className="text-xs">Username</TableHead>
                    <TableHead className="text-xs">Password</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoAccounts.map((account) => (
                    <TableRow key={account.key}>
                      <TableCell className="text-xs">
                        <Badge variant={getRoleBadgeVariant(account.role)}>
                          {account.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{account.email}</TableCell>
                      <TableCell className="text-xs">{account.username}</TableCell>
                      <TableCell className="text-xs">{account.password}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              💡 Google Login cũng hoạt động bình thường
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DemoInfo; 