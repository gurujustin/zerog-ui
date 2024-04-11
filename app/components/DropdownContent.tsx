import GithubLogo from '~/assets/github.svg'
import DocsLogo from '~/assets/docs.svg'
import DiscordLogo from '~/assets/discord.svg'
import AuditLogo from '~/assets/audit.svg'
import TwitterLogo from '~/assets/twitter.svg'
import ArrowRightLogo from '~/assets/arrow-right.svg'

export function DropdownContent() {
  const socials = [
    {
      name: 'Twitter',
      url: 'https://twitter.com/zerogfinance',
      logo: TwitterLogo,
    },
    {
      name: 'Discord',
      url: 'https://discord.gg/zerogfinance',
      logo: DiscordLogo,
    },
    {
      name: 'Github',
      url: 'https://github.com/zero-g-fi',
      logo: GithubLogo,
    },
    {
      name: 'Docs',
      url: 'https://docs.zerog.finance/',
      logo: DocsLogo,
    },
    {
      name: 'Audits',
      url: 'https://docs.zerog.finance/security/audits',
      logo: AuditLogo,
    },
  ]

  return (
    <>
      {socials.map((social) => {
        return (
          <li key={social.name}>
            <a
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="flex"
            >
              <div className="flex justify-between items-center w-full mt-1">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-400">
                    <img
                      alt={social.name}
                      src={social.logo}
                      width={16}
                      height={16}
                    />
                  </div>
                  <p className="ml-2">{social.name}</p>
                </div>
                <img
                  alt={social.name}
                  src={ArrowRightLogo}
                  width={16}
                  height={16}
                />
              </div>
            </a>
          </li>
        )
      })}
    </>
  )
}
