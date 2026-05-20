[中文版本 →](../../../zh/projects/project-01-baseline-vs-minimal-harness/)

> İlgili dersler: [Ders 01. Güçlü modeller güvenilir yürütme anlamına gelmez](./../../lectures/lecture-01-why-capable-agents-still-fail/index.md) · [Ders 02. Harness aslında nedir](./../../lectures/lecture-02-what-a-harness-actually-is/index.md)
> Şablon dosyaları: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# Proje 01. Yalnızca prompt vs. önce kurallar: Aradaki fark ne kadar büyük

## Ne Yapacaksınız

Minimal bir Electron bilgi tabanı uygulama iskeleti inşa edin — solda doküman listesi, sağda Soru-Cevap paneli ve yerel bir veri dizini içeren bir pencere. Görevin kendisi karmaşık değil. Karmaşık olan, ajanın bu görevi tamamlamasını nasıl sağladığınız.

İki kez çalıştırın. İlk seferinde: yalnızca bir prompt, hiçbir hazırlık yok. İkinci seferinde: `AGENTS.md`, `init.sh`, `feature_list.json` önceden depoya yerleştirilmiş. Sonra karşılaştırın.

Bu projenin özü kod yazmak değil — "önce 15 dakika kuralları hazırlamak" ile "ajanı serbest bırakmak" arasındaki farkın ne kadar büyük olduğunu görmek.

## Araçlar

- Claude Code veya Codex (birini seçin ve her iki çalıştırma için de aynısını kullanın)
- Git (dalları yönetin ve karşılaştırın)
- Node.js + Electron (proje yığını)
- Bir zamanlayıcı (her çalıştırmanın süresini kaydedin)

## Harness Mekanizması

Minimal harness: `AGENTS.md` + `init.sh` + `feature_list.json`
