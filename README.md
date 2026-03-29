# 💼 Financial Management System

Aplicação web para gestão financeira pessoal, desenvolvida com foco em organização, análise de dados e boas práticas de engenharia de software.

---

## 📌 Overview

O **Financial Management System** é uma aplicação fullstack que permite ao usuário controlar seus gastos e recebimentos de forma estruturada, oferecendo visualizações analíticas e filtros avançados para tomada de decisão.

O projeto foi desenvolvido com foco em:

- Clareza na visualização de dados financeiros  
- Escalabilidade da arquitetura  
- Boas práticas de desenvolvimento moderno  

---

## 🧱 Tech Stack

### Frontend
- Angular  
- PrimeNG  
- TypeScript  
- SCSS  

### Backend
- .NET (C#)  
- API RESTful  
- Arquitetura baseada em princípios SOLID e DDD  

### Database
- MySQL  

---

## ⚙️ Core Features

### 📊 Financial Dashboard
- Visualização consolidada das finanças  
- Gráfico de pizza com distribuição percentual entre:
  - Gastos  
  - Recebimentos  

---

### 💸 Transaction Management
- Cadastro de transações financeiras com:
  - Valor  
  - Data  
  - Descrição  
  - Método de pagamento  
- Estrutura preparada para expansão futura (categorias, tags, etc.)

---

### 🔍 Advanced Filtering
- Filtros dinâmicos por:
  - Dia  
  - Mês  
  - Ano  
  - Intervalo personalizado  
- Atualização em tempo real dos dados exibidos  

---

### 📈 Financial Summary
- Total de gastos  
- Total de recebimentos  
- Saldo consolidado por período  

---

## 🏗️ Architecture & Design

O sistema foi estruturado seguindo boas práticas de engenharia:

### Frontend
- Arquitetura baseada em **feature modules**  
- Separação clara entre:
  - Components  
  - Services  
  - Models / Interfaces  
- Uso de **Reactive Forms**  
- Organização com **shared modules**  

---

### Backend
- Estrutura em camadas:
  - Application  
  - Domain  
  - Infrastructure  
- Aplicação de conceitos como:
  - Domain-Driven Design (DDD)  
  - Injeção de dependência  
  - DTOs  

---

## 🎯 Key Highlights

- Código organizado e reutilizável  
- Separação de responsabilidades bem definida  
- Estrutura preparada para escalabilidade  
- Integração completa entre frontend e backend  

---

## 🚀 Running the Project

### Frontend

```bash
npm install
ng serve
