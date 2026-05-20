[中文版本 →](../../../zh/projects/project-04-incremental-indexing/)

> İlgili dersler: [Ders 07. Ajanlar için net görev sınırları çizin](./../../lectures/lecture-07-why-agents-overreach-and-under-finish/index.md) · [Ders 08. Ajanın yaptıklarını sınırlamak için özellik listeleri kullanın](./../../lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md)
> Şablon dosyaları: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# Proje 04. Ajan davranışını düzeltmek için runtime geri bildirimi kullanın

## Ne Yapacaksınız

Runtime gözlemlenebilirliği (başlangıç günlükleri, içe aktarma/dizinleme günlükleri, hata durumları) ve katmanlar arası ihlalleri önlemek için mimari kısıtlar ekleyin. Ajanın düzeltmesi için bir runtime hatası yerleştirin.

İki kez çalıştırın: ilk seferinde günlükler veya kısıtlar olmadan, ikinci seferinde uygun araçlar ve kurallarla.

## Araçlar

- Claude Code veya Codex
- Git
- Node.js + Electron

## Harness Mekanizması

Runtime geri bildirimi + kapsam kontrolü + artımlı dizinleme
