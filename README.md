# WebFTP Client

A modern browser-based FTP client that allows users to connect to FTP servers, browse directories, upload and download files, and manage remote file systems directly from a web interface.

## Description

WebFTP Client is a lightweight and user-friendly web application designed to simplify FTP operations without requiring a traditional desktop FTP client. It provides an intuitive interface that enables users to connect to remote FTP servers and perform file management tasks directly from their browser.

The project focuses on usability, performance, and simplicity while maintaining essential FTP functionalities such as file browsing, uploading, downloading, renaming, and deleting files.

This application is ideal for developers, system administrators, and users who want quick FTP access without installing additional software.

## Screenshots

<table>
    <tr>
        <td><img src="" alt="img1"/></td>
        <td><img src="" alt="img2"/></td>
    </tr>
</table>

## Features

- Web-based FTP client interface
- Connect to remote FTP servers
- Browse server directories
- Upload files to FTP server
- Download files from FTP server
- Create directories
- Rename files and folders
- Responsive user interface
- Lightweight and fast performance
- Simple and intuitive navigation (KeyBindings)

## Installation

1. Clone Repo
2. `npm install`
3. Running the Application

#### Terminal 1 - Backend Server (FTP API)
```bash
npm start
```
This starts the FTP backend server on http://localhost:3000

#### Terminal 2 - Frontend Server
```bash
node server/frontend-server.js
```
This starts the frontend on http://localhost:8080
