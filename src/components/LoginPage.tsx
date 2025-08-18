import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Container,
} from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';

interface LoginFormInputs {
  username: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

  // 硬编码的用户名和密码
  const HARDCODED_USERNAME = 'admin';
  const HARDCODED_PASSWORD = '123456';

  const onSubmit = (data: LoginFormInputs) => {
    if (data.username === HARDCODED_USERNAME && data.password === HARDCODED_PASSWORD) {
      // 模拟 token（实际项目中应从后台获取）
      const token = 'mock-token-123';
      localStorage.setItem('token', token); // 存储 token
      navigate('/chat'); // 跳转到聊天页面
    } else {
      alert('Oops, looks like the username or password is incorrect. Try again!');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="User Name"
            autoFocus
            {...register('username', { required: 'Please insert user name' })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            {...register('password', { required: 'Please insert password' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;