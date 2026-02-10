# 3D-модели органов

Поместите сюда файлы GLB-моделей со следующими именами:

| Файл           | Орган    |
|----------------|----------|
| `heart.glb`    | Сердце   |
| `brain.glb`    | Мозг     |
| `lungs.glb`    | Лёгкие   |
| `liver.glb`    | Печень   |
| `kidneys.glb`  | Почки    |
| `stomach.glb`  | Желудок  |

## Формат

- **GLB** (binary glTF) — один файл, текстуры встроены внутрь.
- Рекомендуемый размер файла: до 5 МБ на модель.
- Модель автоматически центрируется и масштабируется в сцене.

## Где скачать бесплатные модели

1. **Sketchfab** (фильтр: downloadable + CC license)
   - https://sketchfab.com/search?q=human+heart+anatomy&type=models&downloadable=true
   - https://sketchfab.com/search?q=human+brain+anatomy&type=models&downloadable=true

2. **Turbosquid** (бесплатные)
   - https://www.turbosquid.com/Search/3D-Models/free/anatomy

3. **CGTrader** (бесплатные)
   - https://www.cgtrader.com/free-3d-models/science/anatomy

4. **NIH 3D Print Exchange** (анатомические модели)
   - https://3d.nih.gov/

## Как конвертировать в GLB

Если модель в другом формате (OBJ, FBX, STL):

1. Откройте в **Blender** (бесплатный, https://www.blender.org/)
2. File → Import → выберите формат
3. File → Export → glTF 2.0 (.glb/.gltf)
   - Format: **glTF Binary (.glb)**
   - Включите «Apply Modifiers» и «Export Materials»

Или используйте онлайн-конвертер:
- https://products.aspose.app/3d/conversion/obj-to-glb
