import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProdukService } from './produk.service';
import { Produk } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';



@Controller('produk')
@ApiTags('produk')

export class ProdukController {
  constructor(private produkService: ProdukService) {}

  @Get()
  async findAll(): Promise<Produk[]> {
    return this.produkService.produks({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Produk> {
    return this.produkService.produk({ id: parseInt(id) });
  }

  @Post()
  @UseInterceptors(FileInterceptor('gambar',{
    storage: diskStorage({
      destination: "./MediaUpload/",
      filename: (req, file, callback) => {
        const uniqueSuffix = uuidv4();
        const fileExtName = path.extname(file.originalname);
        const newFileName = `${uniqueSuffix}${fileExtName}`;
        callback(null, newFileName);
      }
    })
  }))
  async create(@Body() data: any, @UploadedFile() file: Express.Multer.File): Promise<Produk> {
    let { gambar } = data;
    if (file != null) {
      gambar = file.filename;
    }
    return this.produkService.createProduk({
      gambar,
      ...data
    });
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('gambar',{
    storage: diskStorage({
      destination: "./MediaUpload/",
      filename: (req, file, callback) => {
        const uniqueSuffix = uuidv4();
        const fileExtName = path.extname(file.originalname);
        const newFileName = `${uniqueSuffix}${fileExtName}`;
        callback(null, newFileName);
      }
    })
  }))
  async update(@Param('id') id: string, @Body() data: any, @UploadedFile() file: Express.Multer.File): Promise<Produk> {
    let { gambar,harga,...produks } = data;
    if (file != null) {
      // if (gambar !== "") {
      //   const filePath = __dirname+'../../MediaUpload/'+gambar;
      //   fs.unlink(filePath, (err) => {
      //     if (err) {
      //       console.error(err);
      //       return {
      //         status: 'error',
      //         message: 'File not found or could not be deleted',
      //       };
      //     }
      //     console.log(`File ${gambar} deleted`);
      //     return {
      //       status: 'success',
      //       message: `File ${gambar} deleted`,
      //     };
      //   });
      // }
      gambar = file.filename;
    }
    harga = parseInt(harga) as number
    console.log(harga)
    return this.produkService.updateProduk({
      where: { id: parseInt(id) },
      data:{
        gambar,
        harga,
        ...produks
      },
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Produk> {
    return this.produkService.deleteProduk({ id: parseInt(id) });
  }

  @Get('mitra/:mitraId')
  async findByMitra(@Param('mitraId') mitraId: string): Promise<Produk[]> {
    return this.produkService.produksByMitraId(parseInt(mitraId, 10));
  }
}
